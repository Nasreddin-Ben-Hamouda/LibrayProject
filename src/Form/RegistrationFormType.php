<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Notifier\Message\EmailMessage;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\EmailValidator;
use Symfony\Component\Validator\Constraints\IsFalse;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Type;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email',EmailType::class,[
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre email',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('password', PasswordType::class, [
                'mapped'=>false,
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un mot de passe',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Votre mot de passe doit être au moins {{ limit }} caractères',
                        'max' => 4096,
                        'maxMessage' =>'Votre mot de passe est depasse {{ limit }} caractères'
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]

            ])
            ->add('name',TextType::class,[
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer votre nom et prénom',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('address',TextType::class,[
                'label'=>false,
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('studentNumber',NumberType::class,[
                'label'=>false,
                'invalid_message'=>'Le numéro de la carte d\'étudiant doit être numérique',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer le numéro de la carte etudiant',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('phone',NumberType::class,[
                'label'=>false,
                'invalid_message'=>'Le numéro de téléphone doit être numérique',
                'constraints' => [
                    new Length([
                        'min' => 8,
                        'minMessage' => 'Le numéro de téléphone doit être de 8 chiffres',
                        'max' =>8,
                        'maxMessage' =>'Le numéro de téléphone doit être de 8 chiffres'
                    ]),

                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_protection' => false,
        ]);
    }
}
