<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Hashids\Hashids;
use PhpParser\Node\Expr\Array_;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

class HomeController extends AbstractController
{

    private $manager;
    private $hashids;
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    public function __construct(EntityManagerInterface $manager,TokenStorageInterface $tokenStorage)
    {
        $this->manager=$manager;
        $this->hashids=new Hashids('',5);
        $this->tokenStorage = $tokenStorage;

    }
    /**
     * @Route("/", name="home",methods={"GET"})
     */
    public function showHome(Request $request)
    {
        $categories=[];
        $books=$this->manager->getRepository(Book::class)->findAll();
        if ($request->query->getAlnum('s')) {
            $books=$this->manager->getRepository(Book::class)->searchbytitle('%'.$request->query->getAlnum('s').'%');
        }
        foreach ($books as $book){
            if(!in_array($book->getCategory(), $categories)){
                array_push($categories,$book->getCategory());
            }
        }

        return $this->render('home/home.html.twig',['books'=>$books,'categories'=>$categories]);
    }
    /**
     * @Route("/loanBook/{id}", name="loanBook")
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function loanBook($id)
    {

        if(count($this->manager->getRepository(User::class)->checkLoansNotReturned($this->getUser()))>=1){
            $this->addFlash('warning', 'You can t loan two books at the same time');
            return $this->redirectToRoute('home');
        }

        $loan=new Loan();
        $loan->setBook($this->getDoctrine()->getRepository(Book::class)->find($id));
        $loan->setTakenAt(new \DateTime('now'));
        $loan->setUser($this->getUser());
        $this->manager->persist($loan);
        $this->manager->flush();
        $this->addFlash('success', 'Book successfully loan');
        return $this->redirectToRoute('home');
    }
    /*/**
     * @Route("/returnBook/{id}", name="returnbook")
     */
    /*
    public function returnBook($id)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entityManager->remove($this->getDoctrine()->getRepository(Loan::class)->find($id));
        $entityManager->flush();
        $this->addFlash('success', 'Book successfully returned');
        return $this->redirectToRoute('home');
    }*/
    /**
     * @Route("/contacts", name="contacts",methods={"GET"})
     */
    public function showContacts()
    {
        return $this->render('home/contacts.html.twig',[]);
    }
    /**
     * @Route("/about", name="about",methods={"GET"})
     */
    public function showAboutUs()
    {
        return $this->render('home/about.html.twig',[]);
    }
    /**
     * @Route("/profile", name="profile",methods={"GET"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function showProfile()
    {
        return $this->render('home/profile.html.twig',[]);
    }

}
