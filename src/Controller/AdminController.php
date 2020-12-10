<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\User;
use App\Form\UserFormType;
use Doctrine\ORM\EntityManagerInterface;
use Hashids\Hashids;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AdminController extends AbstractController
{
    private $manager;
    private $hashids;
    private $filesystem;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
        $this->hashids=new Hashids('',5);
        $this->filesystem=new Filesystem();
    }
    /**
     * @Route("/admin/dashboard", name="showAdminDashboard",methods={"GET"})
     */
    public function showDashboard()
    {
        $countOfStudent=count($this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT'));
        $countOfLibrarian=count($this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT'));
        $mostFiveBooks=$this->manager->getRepository(Book::class)->mostFiveBooks();
        $mostFiveStudent=$this->manager->getRepository(User::class)->mostFiveStudents();


        return $this->render('admin/dashboard.html.twig',
            [
                'countOfStudent'=>$countOfStudent,
                'countOfLibrarian'=>$countOfLibrarian,
                'mostFiveBooks'=>$mostFiveBooks,
                'mostFiveStudent'=>$mostFiveStudent
            ]);
    }
    /**
     * @Route("/admin/profile", name="showAdminProfile",methods={"GET"})
     */
    public function showProfile()
    {
        return $this->render('admin/profile.html.twig',[]);
    }
    /**
     * @Route("/admin/students", name="showStudents",methods={"GET"})
     */
    public function showStudents()
    {
        $students=$this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT');
        return $this->render('admin/students.html.twig',['students'=>$students]);
    }
    /**
     * @Route("/admin/librarians", name="showLibrarians")
     */
    public function showLibrarians(Request $request,UserPasswordEncoderInterface $passwordEncoder,ValidatorInterface $validator)
    {
        $librarian = new User();
        $form = $this->createForm(UserFormType::class, $librarian);
        $form->handleRequest($request);
        $librarians=$this->manager->getRepository(User::class)->findUsersByRole('ROLE_LIBRARIAN');
        if ($form->isSubmitted()) {
            if( !$form->isValid()){
                $errors=$validator->validate($form);
                foreach ($errors as $error){
                    $this->addFlash('error',$error->getMessage());
                }
                $form->clearErrors(true);

            }else{
                $userCheck=$this->manager->getRepository(User::class)->findOneBy([
                    'email'=>$form->get('email')->getData()
                ]);
                if($form->get('id')->getData()){

                    $oldLibrarian=$this->manager->getRepository(User::class)->find($this->hashids->decodeHex($form->get('id')->getData()));
                    if($userCheck and $oldLibrarian->getId()!=$userCheck->getId()){
                        $this->addFlash('warning','L\'émail entré est déja utilisé');
                    }else{
                        $oldLibrarian->setName($librarian->getName());
                        $oldLibrarian->setEmail($form->get('email')->getData());
                        $oldLibrarian->setAddress($librarian->getAddress());
                        $oldLibrarian->setPhone($librarian->getPhone());
                        $oldLibrarian->setSalary($librarian->getSalary());
                        $this->addFlash('success','Bibliothécaire modifié avec succès ');
                    }
                }else{
                    if($userCheck){
                        $this->addFlash('warning','L\'émail entré est déja utilisé');
                    }else{
                        $librarian->setPassword($passwordEncoder->encodePassword(
                            $librarian,
                            $form->get('password')->getData()
                        ));
                        $librarian->setEmail($form->get('email')->getData());
                        $librarian->setRoles(array('ROLE_LIBRARIAN'));
                        $librarian->setIsVerified(true);
                        $this->manager->persist($librarian);
                        $this->addFlash('success','Bibliothécaire ajouté avec succès ');
                    }

                }

                $this->manager->flush();
                return $this->redirectToRoute('showLibrarians');
            }

        }
        return $this->render('admin/librarians.html.twig',[
            'librarians'=>$librarians,
            'userForm'=>$form->createView()
        ]);
    }
    /**
     * @Route("/admin/students/{id}/{role}/delete", name="handleDeleteUser",methods={"GET"})
     */
    public function handleDeleteUser($id,$role){
        $user=$this->manager->getRepository(User::class)->find($this->hashids->decodeHex($id));
        if($user){
            if($user->getPhoto()){
                $this->filesystem->remove($this->getParameter('storage').'/images/avatar/'.$user->getPhoto());
            }
            $this->manager->remove($user);
            $this->manager->flush();
            $this->addFlash('success','Etudiant supprimé avec succès');
        }else{
            $this->addFlash('error','Etudiant inexistant');
        }
        if($role=="librarian")
            return $this->redirectToRoute('showLibrarians');
        else
            return $this->redirectToRoute('showStudents');
    }
}
